import { inject } from "@angular/core";
import { IndexedDbService } from "../services/indexed-db.service";
import { UtilsService } from "../services/utils.service";
import { environment } from "../../../environments/environment.development";
import { StorageService } from "../services/storage.service";

// Initialization of the system
export function initializeApp() {
  return async () => {
    const appVersion = environment.version;
    const isElectron = window.system?.isElectron;
    const utils = inject(UtilsService);
    const storage = inject(StorageService);

    // Generate player unique code
    if (!storage.hasKey('code')) {
      storage.set('code', utils.genereteScreenCode(9));
    }

    const playerCode = storage.get('code');

    // Initialize IndexedDB
    const indexedDbService = inject(IndexedDbService);

    if (isElectron) utils.loadSystemInfo();
    else utils.systemInfo.set({ appVersion, code: playerCode });

    console.log(isElectron ? 'Running in Electron' : 'Running in Browser');
    return await indexedDbService.database();
  }
}