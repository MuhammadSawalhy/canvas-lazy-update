class StatusManager{
    constructor(statuses){

        this.status = 'ready';
        this.statuses = statuses;

        //#region avaliable statuses
        let statuesObj = {};
        statuses.forEach(a=>{
            statuesObj[a.toUpperCase()] = a;
            statuesObj[a] = function(){ this.status = a; };
        });
        Object.assign(this, statuesObj);
        //#endregion

    }

    get status(){ return this.__status; }
    set status(v){
        this.__status = v;
    }
    set(v){
        this.status = v;
    }
    
    is(a){
        return this.__status === a;
    }

    isAllowed(){
        return this.__status === "ready" || this.isDone();
    }
    
    isReAllowed(){
        return this.__status === this.statuses[1];
    }

    isDone(){
        return this.__status === this.statuses[2];
    }

}

export class DrawStatusManager extends StatusManager {
    constructor(){
        super( [
            'drawing', 'redraw', 'drawed',
        ]);
    }
}

export class UpdateStatusManager extends StatusManager {
    constructor(){
        super( [
            'updating', 'reupdate', 'updated',
        ]);
    }
}

export class GenSVGStatusManager extends StatusManager {
    constructor(){
        super( [
            'generating', 'regenerate', 'generated',
        ]);
    }
}

export default {
    DrawStatusManager,
    UpdateStatusManager,
};
