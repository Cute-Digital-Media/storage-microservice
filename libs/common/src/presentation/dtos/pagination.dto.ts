export class PaginationDto
{
    constructor(
        public limit: number,   
        public page: number
    ) {}
}