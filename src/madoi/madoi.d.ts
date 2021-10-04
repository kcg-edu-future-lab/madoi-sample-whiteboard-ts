export declare function ShareClass(option?: any): (target: any) => void;
export interface ShareConfig {
    type?: "beforeExec" | "afterExec";
    maxLog?: number;
    allowedTo?: string[];
    update?: {
        freq?: number;
        interpolateBy?: number;
        reckonUntil?: number;
    };
}
export declare function Share(config?: ShareConfig): (target: any, name: string, descriptor: PropertyDescriptor) => void;
export interface GetStateConfig {
    maxInterval?: number;
    maxUpdates?: number;
}
export declare function GetState(config?: GetStateConfig): (target: any, name: string, descriptor: PropertyDescriptor) => void;
export interface SetStateConfig {
}
export declare function SetState(config?: SetStateConfig): (target: any, name: string, descriptor: PropertyDescriptor) => void;
export interface MethodConfig {
    share?: ShareConfig;
    getState?: GetStateConfig;
    setState?: SetStateConfig;
}
interface PeerInfo {
    peerId: string;
    order: number;
}
export declare class Madoi {
    private connecting;
    private interimQueue;
    private sharedFunctions;
    private sharedObjects;
    private getStateMethods;
    private setStateMethods;
    private promises;
    private changedObjects;
    private handlers;
    private ws;
    private selfPeerId;
    private currentSenderPeerId;
    constructor(servicePath: string, key?: string, options?: {});
    getCurrentSenderPeerId(): string | null;
    isSelfCall(): boolean;
    close(): void;
    private handleOnOpen;
    private handleOnClose;
    private handleOnError;
    private handleOnMessage;
    private data;
    onOpen(_e: Event): void;
    onClose(_e: Event): void;
    onError(_e: Event): void;
    onElse(_msg: any): void;
    onEnterRoom(selfId: string, peerIds: PeerInfo[]): void;
    onLeaveRoom(): void;
    onPeerJoin(peerId: string): void;
    onPeerLeave(peerId: string): void;
    send(type: string, body: object, headers: object): void;
    sendMessage(msg: object): void;
    register(obj: any, methodAndConfigs?: [Function, MethodConfig][]): void;
    registerFunction(func: Function, config: ShareConfig): () => any;
    private addSharedFunction;
    private saveStates;
    private applyInvocation;
}
export {};
