/*extern importClass Packages*/
/*extern FileInputStream java*/
// needed for JSLint

importClass(Packages.java.io.FileInputStream);

function reader(filename){
    var count=0;
    var fileStream=new FileInputStream(filename);
    var buffer=null; // read buffer
    var offset=0; // offset we are into the buffer
    var max=0; // same as buffer.length hopefully

    return function(){
	var next=null; // next byte returned
	var read=0; // how many we read (used to detect EOF)

	if(offset>=max){ // time to refill the buffer
	    if(fileStream.available()===0){
		read=fileStream.read(); // none available, block, we'll get it next time.
		next=read;
	    }else{
		buffer=java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE,fileStream.available());
		max=fileStream.read(buffer,0,buffer.length);
		read=max;
		offset=0;
		next=buffer[offset++];
	    }
	}else{ // still some in the buffer from last fill
	    next=buffer[offset++];
	}

	if(read===-1){ // EOF, oh no!
	    print('EOF reached unexpectedly at byte '+count+
		  ' in '+filename+'. Are you sure this is a TST file?');
	    quit(1);
	}

	count++;
	if(next<0){next+=256;} // make it unsigned
	return next;
    };
}

function readWord(read){
    var byte1=read();
    var byte2=read();
    return byte1+(byte2<<8);
}

function detailDescription(detailNum){
    switch(detailNum){
    case 1:return '32x32 pixels x 16.7 million colors';
    case 2:return '16x16 pixels x 16.7 million colors';
    case 3:return '32x32 pixels x 256 colors UNSUPPORTED';
    case 4:return '16x16 pixels x 256 colors UNSUPPORTED';
    case 5:return '32x32 pixels x 16 colors UNSUPPORTED';
    case 6:return '16x16 pixels x 16 colors UNSUPPORTED';
    default:return 'unknown detail level; file is probably corrupt.';
    }
}

function tileWidth(detail){
    if(detail%2===0){
	return 16;
    }else{
	return 32;
    }
}

function numPixels(detail){
    return tileWidth(detail)*tileWidth(detail);
}

function readPixel(read,detail){
    if(detail===1 || detail===2){// rgb-mode
	var r=read();
	var g=read();
	var b=read();

	if(r===0 && g===1 && b===2){ // transparent
	    return 0; // all zeros, including alpha
	}

	return (0xff << 24)+
	    (r << 16)+
	    (g << 8)+
	    (b);

    }else{// 256-color mode
	var color=read();
	return 0; //unsupported as yet
    }
}

function readTile(read,detail){
    var colors=[];
    var pixels=numPixels(detail);
    for(var i=0;i<pixels;i++){
	colors[i]=readPixel(read,detail);
    }
    return colors;
}

function supportedDetail(detail){
    return (detail===1 || detail===2);
}

function transparentColor(detail){ // The color of transparent pixels in the PNG file for this
    return 0;
}

function transformForTransparency(pixels,width,params){
    if(!params.transparent){return pixels;} // there's no special transparent color, so bail
    var newPixels=[];
    for(var i=0;i<pixels.length;i++){

	if(pixels[i]!==params.transparent){
	    newPixels[i]=pixels[i];
	}else if(!params.border){
	    newPixels[i]=0;
	}else{
	    var x=i%width;
	    var y=Math.floor(i/width);

	    // if this is adjacent to any opaque pixels
	    if((x>0 && pixels[i-1]!==0 && pixels[i-1]!==params.transparent) ||
	       (x<width-1 && pixels[i+i]!==0 && pixels[i+1]!==params.transparent) ||
	       (y>0 && pixels[i-width]!==0 && pixels[i-width]!==params.transparent) ||
	       (y<width-1 && pixels[i+width]!==0 && pixels[i+width]!==params.transparent)){
		newPixels[i]=pixels[i];
	    }else{
		newPixels[i]=0;
	    }
	}
    }

    return newPixels;
}