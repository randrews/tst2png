load('process.js');
load('flags.js');
/*extern parseFlag processFile*/

if(!arguments || arguments.length===0){
    print('Usage: tst2png [options] filenames');
    quit();
}

var flag=null;
var params={
    verbose:true,
    tilesPerRow:8,
    overwrite:false,
    border:false,
    scale:1,
    process:true
};

for(var i=0;i<arguments.length;i++){
    if(flag!==null){
	params=parseFlag(flag,arguments[i],params);
	flag=null;
    }else if(arguments[i][0]==='-'){
	flag=arguments[i];
    }else{
	processFile(arguments[i],params);
    }
}
