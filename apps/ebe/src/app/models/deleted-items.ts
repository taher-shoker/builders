export interface DeletedProgram
{
    id?:number;
    planned:number | null;
    sector:string;
    actual:number;
    details:string;
    plannedDate:string | null;
}