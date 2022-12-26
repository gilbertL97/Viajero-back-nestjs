import { join } from 'path';
import * as fs from 'fs';
export class FileHelper {
  static uploadsPath = join(__dirname, '..', '..', '..', 'uploads');
  static uploadsCoverage = join(this.uploadsPath, 'coverages');
  static uploadsCohtractors = join(this.uploadsPath, 'contratctors');

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
  public static async deleteFolder(
    entities: string,
    name: string,
  ): Promise<void> {
    const folder = join(this.uploadsPath, entities, name);
    fs.rmSync(folder, { recursive: true, force: true });
  }
  public static async moveFile(newq: string, old: string): Promise<void> {
    fs.rename(old, newq, (error) => {
      if (error) throw error;
    });
  }
  public static async deletFile(path: string): Promise<void> {
    fs.rmSync(path);
  }
}
