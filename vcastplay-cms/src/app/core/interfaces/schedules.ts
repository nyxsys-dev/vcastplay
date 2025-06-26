export interface Schedule {
    id: number,
    title: string,
    description: string,
    contents: any[];
    start: Date;
    end: Date;
    status: string;
    createdOn: Date,
    updatedOn: Date
}