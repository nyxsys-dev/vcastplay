import { inject } from "@angular/core";
import { IndexedDbService } from "../services/indexed-db.service";
import { UtilsService } from "../services/utils.service";
import { PlayerService } from "../services/player.service";
import { Playlist } from "./playlist";

// Initialization of the system
export function initializeApp() {
  return async () => {
    const isElectron = window.system?.isElectron;
    const utils = inject(UtilsService);
    // Initialize IndexedDB
    const indexedDbService = inject(IndexedDbService);

    if (isElectron) utils.loadSystemInfo();

    console.log(isElectron ? 'Running in Electron' : 'Running in Browser');
    return await indexedDbService.database();
  }
}