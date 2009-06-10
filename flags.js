function parseFlag(flag,next,params){
    params=params||{};

    switch(flag){
    case '-columns':
	if(isNaN(next)){break;}
	params.tilesPerRow=Number(next);
	break;
    case '-verbose':
	if(next==='true'){
	    params.verbose=true;
	}else if(next==='false'){
	    params.verbose=false;
	}
	break;
    case '-overwrite':
	if(next==='true'){
	    params.overwrite=true;
	}else if(next==='false'){
	    params.overwrite=false;
	}
	break;
    case '-transparent':
	var matches=next.match(/^([a-f0-9]{6})$/);
	if(!matches){break;}
	params.transparent=java.lang.Integer.parseInt(matches[1],16);
	params.transparent+=(0xff << 24); // it's opaque, obviously
	break;
    case '-border':
	if(next==='true'){
	    params.border=true;
	}else if(next==='false'){
	    params.border=false;
	}
	break;
    case '-scale':
	if(isNaN(next)){break;}
	var scale=Math.floor(Number(next));
	if(scale>0){
	    params.scale=scale;
	}
	break;
    case '-process':
	if(next==='true'){
	    params.process=true;
	}else if(next==='false'){
	    params.process=false;
	}
	break;
    default:break;
    }

    return params;
}