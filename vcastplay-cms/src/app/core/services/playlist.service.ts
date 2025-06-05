import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  playlistItems = signal<any[]>([]);

  constructor() { }
}
