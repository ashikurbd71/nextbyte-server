import { Module } from '../../module/entities/module.entity';
export declare class Lesson {
    id: number;
    title: string;
    description: string;
    order: number;
    duration: string;
    videoUrl: string;
    fileUrl: string;
    text: string;
    thumbnail: string;
    isPreview: boolean;
    isActive: boolean;
    module: Module;
    createdAt: Date;
    updatedAt: Date;
}
