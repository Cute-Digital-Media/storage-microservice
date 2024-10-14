export class GetOneFileDto
{
    constructor(
        public fileName: string, 
        public isPrivate: boolean   
    ) {}
}