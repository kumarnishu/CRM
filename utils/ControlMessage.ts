import WAWebJS, { Client, MessageMedia } from "whatsapp-web.js";
import { Flow } from "../models/bot/Flow";
import { toTitleCase } from "./ToTitleCase";
import { MenuTracker } from "../models/bot/MenuTracker";
import { KeywordTracker } from "../models/bot/KeywordTracker";
import { CronJob } from "cron";
import { User } from "../models/users/user.model";
import { FlowNode, IKeywordTracker } from "../types/bot.types";


export const ControlMessage = async (client: Client, msg: WAWebJS.Message) => {
    let init_msg = "👉🏻"
    const from = await client.getNumberId(msg.from);
    let comingMessage = String(msg.body).toLowerCase()
    let sendingMessage = ""
    let trackers = await KeywordTracker.find({ phone_number: from?._serialized, bot_number: msg.to }).populate({
        path: 'flow',
        populate: [
            {
                path: 'connected_users',
                model: 'User'
            }
        ]
    })
    let tracker = trackers.find((tracker) => {
        let keys = tracker.flow.trigger_keywords.split(",");
        for (let i = 0; i < keys.length; i++) {
            if (comingMessage.split(" ").includes(keys[i])) {
                return tracker
            }
        }
    })
    let menuTracker = await MenuTracker.findOne({ phone_number: from?._serialized, bot_number: String(msg.to) }).populate({
        path: 'flow',
        populate: [
            {
                path: 'connected_users',
                model: 'User'
            }
        ]
    })
    let user = await User.findOne({ connected_number: String(msg.to) })
    let flows = await Flow.find({ is_active: true }).populate('connected_users')

    flows = flows.filter((flow) => {
        let flow_numbers = flow.connected_users && flow.connected_users.map((u) => { return u.connected_number })
        if (flow.connected_users && flow.connected_users.find((u) => {
            return u.connected_number === user?.connected_number
        }))
            if (!flow_numbers.includes(String(from?._serialized)))
                return flow

    })
    if (flows.length > 0) {
        if (!tracker) {
            let flow = flows.find((flow) => {
                let keys = flow.trigger_keywords.split(",");
                for (let i = 0; i < keys.length; i++) {
                    if (comingMessage.split(" ").includes(keys[i])) {
                        return flow
                    }
                }
                return null
            })
            if (flow && from) {
                let commonNode = flow.nodes.find((node) => node.id === "common_message")
                sendingMessage = sendingMessage + String(commonNode?.data.media_value) + "\n\n"
                let parent = flow.nodes.find(node => node.parentNode === "common_message")
                if (parent) {
                    let sendingNodes = flow.nodes.filter((node) => { return node.parentNode === parent?.id })
                    sendingNodes.sort(function (a, b) {
                        var keyA = new Date(a.data.index),
                            keyB = new Date(b.data.index);
                        // Compare the 2 dates
                        if (keyA < keyB) return -1;
                        if (keyA > keyB) return 1;
                        return 0;
                    });
                    sendingNodes.forEach(async (node) => {
                        sendingMessage = sendingMessage + init_msg + node.data.media_value + "\n"
                    })
                    await client?.sendMessage(from._serialized, sendingMessage)
                    await new KeywordTracker({
                        phone_number: String(from._serialized),
                        bot_number: String(msg.to),
                        flow: flow
                    }).save()
                    if (!menuTracker) {
                        await new MenuTracker({
                            menu_id: flow.nodes.find(node => node.parentNode === "common_message")?.id,
                            phone_number: String(from._serialized),
                            bot_number: String(msg.to),
                            updated_at: new Date(),
                            flow: flow
                        }).save()
                    }
                    if (menuTracker) {
                        let id = flow.nodes.find(node => node.parentNode === "common_message")?.id
                        if (id) {
                            menuTracker.menu_id = id
                            menuTracker.flow = flow,
                                menuTracker.updated_at = new Date(),
                                await menuTracker.save()
                        }

                    }

                }
            }
        }
        if (tracker && menuTracker && from) {
            if (tracker.is_active && !tracker.skip_main_menu) {
                menuTracker = await MenuTracker.findOne({ phone_number: tracker.phone_number })
                let startTriggered = false
                let keys = tracker.flow.trigger_keywords.split(",");
                for (let i = 0; i < keys.length; i++) {
                    if (comingMessage.split(" ").includes(keys[i])) {
                        startTriggered = true
                        break
                    }
                }
                if (comingMessage === '0' || startTriggered) {
                    let commonNode = tracker?.flow.nodes.find((node) => node.id === "common_message")
                    if (startTriggered) {
                        if (menuTracker && menuTracker.customer_name) {
                            sendingMessage = sendingMessage + "Hello " + toTitleCase(menuTracker.customer_name) + "\n\n"
                        }
                        sendingMessage = sendingMessage + String(commonNode?.data.media_value) + "\n\n"
                    }
                    let parentNode = tracker?.flow.nodes.find((node) => node.parentNode === "common_message")
                    let sendingNodes = tracker?.flow.nodes.filter((node) => { return node.parentNode === parentNode?.id })
                    sendingNodes.sort(function (a, b) {
                        var keyA = new Date(a.data.index),
                            keyB = new Date(b.data.index);
                        // Compare the 2 dates
                        if (keyA < keyB) return -1;
                        if (keyA > keyB) return 1;
                        return 0;
                    });
                    sendingNodes.forEach(async (node) => {
                        sendingMessage = sendingMessage + init_msg + node.data.media_value + "\n"
                    })
                    await client?.sendMessage(from._serialized, sendingMessage)
                    if (parentNode) {
                        if (menuTracker) {
                            menuTracker.menu_id = parentNode.id
                            menuTracker.flow = tracker.flow,
                                menuTracker.updated_at = new Date(),
                                await menuTracker.save()
                        }
                    }
                }
                await KeywordTracker.findByIdAndUpdate(tracker._id, { skip_main_menu: true })
                SkippedMainMenuActivate(tracker)
            }
        }
        if (!tracker && menuTracker && from) {
            if (comingMessage === '0') {
                let commonNode = menuTracker.flow.nodes.find((node) => node.id === "common_message")
                sendingMessage = sendingMessage + String(commonNode?.data.media_value) + "\n\n"
                let parentNode = menuTracker.flow.nodes.find((node) => node.parentNode === "common_message")
                let sendingNodes = menuTracker.flow.nodes.filter((node) => { return node.parentNode === parentNode?.id })
                sendingNodes.sort(function (a, b) {
                    var keyA = new Date(a.data.index),
                        keyB = new Date(b.data.index);
                    // Compare the 2 dates
                    if (keyA < keyB) return -1;
                    if (keyA > keyB) return 1;
                    return 0;
                });
                sendingNodes.forEach(async (node) => {
                    sendingMessage = sendingMessage + init_msg + node.data.media_value + "\n"
                })
                await client?.sendMessage(from._serialized, sendingMessage)
                if (parentNode) {
                    if (menuTracker) {
                        menuTracker.menu_id = parentNode.id,
                            menuTracker.updated_at = new Date(),
                            await menuTracker.save()
                    }
                }
            }
            if (menuTracker.is_active) {
                let parent = menuTracker.flow.nodes.find((node) => node.id === menuTracker?.menu_id)
                if (parent) {
                    let sendingNodes = menuTracker.flow.nodes.filter((node) => { return node.parentNode === parent?.id })
                    let targetNode = sendingNodes.filter((node) => {
                        let index = String(node.data.index)
                        if (index === comingMessage) {
                            return node
                        }
                        return undefined
                    })[0]
                    if (targetNode) {
                        let childNodes: FlowNode[] | undefined = menuTracker.flow.nodes.filter((node) => { return node.parentNode === targetNode?.id })
                        let childOutputNodes = childNodes.filter((node) => { return node.type === "OutputNode" })

                        let childMenuNodes = childNodes.filter((node) => { return node.type === "MenuNode" })

                        if (childMenuNodes.length > 0) {
                            let menuNode = childMenuNodes[0]
                            if (menuNode) {
                                let sendingNodes = menuTracker.flow.nodes.filter((node) => { return node.parentNode === menuNode.id })
                                sendingNodes.sort(function (a, b) {
                                    var keyA = new Date(a.data.index),
                                        keyB = new Date(b.data.index);
                                    // Compare the 2 dates
                                    if (keyA < keyB) return -1;
                                    if (keyA > keyB) return 1;
                                    return 0;
                                });
                                sendingNodes.forEach(async (node) => {
                                    sendingMessage = sendingMessage + init_msg + node.data.media_value + "\n"
                                })
                                sendingMessage = "\n" + sendingMessage + init_msg + "Press 0 for main menu\n"
                                await client?.sendMessage(from._serialized, sendingMessage)
                                if (menuTracker) {
                                    menuTracker.menu_id = menuNode.id,
                                        menuTracker.updated_at = new Date(),
                                        await menuTracker.save()
                                }

                            }
                        }
                        if (childOutputNodes.length > 0) {
                            childOutputNodes?.forEach(async (node) => {
                                if (node.data.media_type === "message") {
                                    let nodeText = String(node.data.media_value).split("\\n")
                                    let message = ""
                                    for (let i = 0; i < nodeText.length; i++) {
                                        message = message + nodeText[i] + "\n"
                                    }
                                    await client?.sendMessage(from._serialized, message)
                                }
                                else {
                                    let message = await MessageMedia.fromUrl(String(node.data.media_value));
                                    await client?.sendMessage(from._serialized, message)
                                }

                            })
                        }
                    }
                }
            }
        }
    }

}


async function SkippedMainMenuActivate(tracker: IKeywordTracker) {
    let time = new Date(new Date().getTime() + 2 * 60 * 60 * 1000)
    new CronJob(time, async () => {
        await KeywordTracker.findByIdAndUpdate(tracker._id, { skip_main_menu: false })
    })
}