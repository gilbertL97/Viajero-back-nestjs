import { join } from 'path';
import * as fs from 'fs';
export class FileHelper {
  static uploadsPath = join(__dirname, '..', '..', '..', 'uploads');
  public static async createFolder(
    entities: string,
    name: string,
  ): Promise<void> {
    const folderContract = join(this.uploadsPath, entities, name);
    console.log(folderContract);
    fs.mkdir(folderContract, { recursive: true }, (error) => {
      if (error) console.log(error);
    });
    console.log(folderContract);
  }
  public static async updateFolder(
    entities: string,
    name: string,
    old: string,
  ): Promise<void> {
    const folderContractNew = join(this.uploadsPath, entities, name);
    const folderContractOld = join(this.uploadsPath, entities, old);
    fs.rename(folderContractOld, folderContractNew, (error) => {
      if (error) throw error;
    });
  }
  public static async deletFolder(
    entities: string,
    name: string,
  ): Promise<void> {
    const folder = join(this.uploadsPath, entities, name);
    fs.rmSync(folder, { recursive: true, force: true });
  }
}
