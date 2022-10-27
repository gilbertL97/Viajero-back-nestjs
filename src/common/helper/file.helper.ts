import { join } from 'path';
import * as fs from 'fs';
export class FileHelper {
  static uploadsPath = join(__dirname, '..', '..', 'uploads');
  public static async createFolder(name: string): Promise<void> {
    const folderContract = join(this.uploadsPath, name);
    fs.mkdir(folderContract, { recursive: true }, (error) => {
      if (error) console.log(error);
    });
    console.log(folderContract);
  }
  public static async updateFolder(name: string, old: string): Promise<void> {
    const folderContractNew = join(this.uploadsPath, name);
    const folderContractOld = join(this.uploadsPath, old);
    fs.rename(folderContractOld, folderContractNew, (error) => {
      if (error) throw error;
    });
  }
  public static async deletFolder(name: string): Promise<void> {
    const folder = join(this.uploadsPath, name);
    fs.rmSync(folder, { recursive: true, force: true });
  }
}
