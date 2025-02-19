import { PostComment } from "./postComment.model";

export interface Post {
    id: number; 
    user_id: number;
    title: string;
    body: string;
    comments?: PostComment[];
}