export type IChat = {
    from: string,
    name: string,
    isGroup: boolean,
    author?: string,
    connected_number: string,
    body: string,
    authorName: string,
    hasMedia: boolean,
    timestamp: Date,
    created_at: Date,
}