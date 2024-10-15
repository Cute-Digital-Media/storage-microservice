import { AutoMap } from "@automapper/classes";
import { BaseDomainEntity } from "libs/common/domain/base-domain.entity";
import { UserEntity } from "./user.entity";

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

    @AutoMap()
    public userId: string

    @AutoMap()
    public user?: UserEntity

    @AutoMap()
    public isPrivate: boolean   

    @AutoMap()
    public originalFileName: string   

    @AutoMap()
    public thumbnailFileName: string   
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