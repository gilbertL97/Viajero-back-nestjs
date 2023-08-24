import * as archiver from 'archiver';
import * as fe from 'fs-extra';
export class ExternalFilesHelper {
  public static compressFolder(path: string): Promise<Buffer> {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const chunks: Buffer[] = [];
    return new Promise((resolve, reject) => {
      archive.on('error', (err) => {
        reject(err);
      });

      archive.on('data', (chunk) => {
        chunks.push(chunk);
      });

      archive.on('end', () => {
        resolve(Buffer.concat(chunks));
      });

      archive.directory(path, false);
      archive.finalize();
    });
  }
  public static async moveFolders(origing: string, dest: string) {
    await fe.moveSync(origing, dest, { overwrite: true });
  }
}
