import { InputState } from './types';

export class InputManager {
  private keys: Set<string> = new Set();
  private p1State: InputState = { left: false, right: false, up: false, attack: false, special: false, block: false };
  private p2State: InputState = { left: false, right: false, up: false, attack: false, special: false, block: false };

  // Track single-press keys (attack/special - need to be consumed)
  private p1AttackPressed = false;
  private p1SpecialPressed = false;
  private p2AttackPressed = false;
  private p2SpecialPressed = false;

  constructor() {
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  attach() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  detach() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }

  private onKeyDown(e: KeyboardEvent) {
    if (e.repeat) return;
    this.keys.add(e.code);

    // P1: A/D/W/F/G/E
    if (e.code === 'KeyA') this.p1State.left = true;
    if (e.code === 'KeyD') this.p1State.right = true;
    if (e.code === 'KeyW') this.p1State.up = true;
    if (e.code === 'KeyF') { this.p1State.attack = true; this.p1AttackPressed = true; }
    if (e.code === 'KeyG') { this.p1State.special = true; this.p1SpecialPressed = true; }
    if (e.code === 'KeyE') this.p1State.block = true;

    // P2: Arrow keys + K/L/O
    if (e.code === 'ArrowLeft') this.p2State.left = true;
    if (e.code === 'ArrowRight') this.p2State.right = true;
    if (e.code === 'ArrowUp') this.p2State.up = true;
    if (e.code === 'KeyK') { this.p2State.attack = true; this.p2AttackPressed = true; }
    if (e.code === 'KeyL') { this.p2State.special = true; this.p2SpecialPressed = true; }
    if (e.code === 'KeyO') this.p2State.block = true;
  }

  private onKeyUp(e: KeyboardEvent) {
    this.keys.delete(e.code);

    if (e.code === 'KeyA') this.p1State.left = false;
    if (e.code === 'KeyD') this.p1State.right = false;
    if (e.code === 'KeyW') this.p1State.up = false;
    if (e.code === 'KeyF') this.p1State.attack = false;
    if (e.code === 'KeyG') this.p1State.special = false;
    if (e.code === 'KeyE') this.p1State.block = false;

    if (e.code === 'ArrowLeft') this.p2State.left = false;
    if (e.code === 'ArrowRight') this.p2State.right = false;
    if (e.code === 'ArrowUp') this.p2State.up = false;
    if (e.code === 'KeyK') this.p2State.attack = false;
    if (e.code === 'KeyL') this.p2State.special = false;
    if (e.code === 'KeyO') this.p2State.block = false;
  }

  getPlayer1(): InputState {
    return { ...this.p1State };
  }

  getPlayer2(): InputState {
    return { ...this.p2State };
  }

  consumeP1Attack(): boolean {
    if (this.p1AttackPressed) { this.p1AttackPressed = false; return true; }
    return false;
  }

  consumeP1Special(): boolean {
    if (this.p1SpecialPressed) { this.p1SpecialPressed = false; return true; }
    return false;
  }

  consumeP2Attack(): boolean {
    if (this.p2AttackPressed) { this.p2AttackPressed = false; return true; }
    return false;
  }

  consumeP2Special(): boolean {
    if (this.p2SpecialPressed) { this.p2SpecialPressed = false; return true; }
    return false;
  }

  isKeyDown(code: string): boolean {
    return this.keys.has(code);
  }
}