import { AutoMap } from "@automapper/classes";
import { ValidMimeTypes } from "../constants/valid-mime-types.constant";
import { AppError } from "libs/common/application/errors/app.errors";


export class FileEntityProps
{
    @AutoMap()
    public fileName: string

    @AutoMap()
    public type: string

    @AutoMap()
    public size: number   

    @AutoMap()
    public metadata?: object

    @AutoMap()
    public url?: string
} 

export class  BaseDomainEntity
{
    id: string; 
}
export class FileEntity extends BaseDomainEntity 
{
    constructor(props: FileEntityProps) {
        super();
        this.props = props;
    }
    
    public props : FileEntityProps 
    
    public setUrl(url: string)
    {
        this.props.url = url; 
    }
}