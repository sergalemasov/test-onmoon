export interface FilterDto {
    id: number;
    name: string;
    operators: string[];
    parameterCount: number;
    parameterValues: (string[] | null)[];
}
