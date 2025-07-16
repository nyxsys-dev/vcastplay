import { inject } from "@angular/core";
import { IndexedDbService } from "../services/indexed-db.service";
import { UtilsService } from "../services/utils.service";
import { environment } from "../../../environments/environment.development";
import { StorageService } from "../services/storage.service";
import { v7 as uuidv7 } from 'uuid';
import { PlatformService } from "../services/platform.service";

// Initialization of the system
export function initializeApp() {
  return async () => {
    const appVersion = environment.version;
    const utils = inject(UtilsService);
    const storage = inject(StorageService);
    const platformService = inject(PlatformService);

    platformService.initializeApp();

    const platform = platformService.platform;

    // Generate player: unique code, player code, platform and app version
    if (!storage.hasKey('code')) {
      storage.set('code', uuidv7());
      storage.set('platform', platform);
      storage.set('playerCode', utils.genereteScreenCode(6));
      storage.set('appVersion', appVersion);
    }
  }
}