import { v4 } from 'uuid';

export class StringExtension 
{
    
    public static generateFileName(fileName: string): string {
        const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
        const uniqueId = v4();
    
        fileName = `${fileName}_${timestamp}_${uniqueId}`;

        fileName = fileName
            .trim() 
            .replace(/ +/g, '_')
            .replace(/[^\w\-\/_.]/g, '')
            .replace(/_{2,}/g, '_');   

        return fileName;    
    }
}