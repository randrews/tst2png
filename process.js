/*extern importClass Packages*/

load('utils.js');
/*extern
  reader 
  detailDescription
  readWord
  tileWidth
  readTile
  supportedDetail*/

importClass(Packages.java.awt.image.BufferedImage);
importClass(Packages.javax.imageio.ImageIO);
importClass(Packages.java.io.File);
/*extern BufferedImage ImageIO File*/

function readHeader(filein){
    return {
	version:readWord(filein),
	    numberOfTiles:readWord(filein),
	    detail:readWord(filein)
    };
}

function processFile(filename,params){
    var filein=reader(filename);

    var header=readHeader(filein);

    if(params.verbose){
	print(filename);
	print('\tversion: '+(header.version/10));
	print('\tnumber of tiles: '+header.numberOfTiles);
	print('\tdetail: '+detailDescription(header.detail));
    }

    if(!params.process){return;}

    /////// Check the detail level
    if(!supportedDetail(header.detail)){
	print('Detail level '+header.detail+' is not yet supported. Only RGB files work currently. Skipping.');
	return;
    }

    /////// Handle the output file
    var match=filename.match(/(.*)\.[tT][sS][tT]$/);
    var outfilename='';
    if(!match){
	outfilename=filename+'.png';
    }else{
	outfilename=match[1]+'.png';
    }

    var outfile=new File(outfilename);
    if(outfile.exists() && !params.overwrite){
	print('File '+outfilename+' already exists; use "-overwrite true" to overwrite it. Skipping.');
	return;
    }
    if(!outfile.exists()){
	var created=outfile.createNewFile();
	if(!created){
	    print('Could not create file '+outfilename+', skipping.');
	    return;
	}
    }
    if(outfile.exists() && !outfile.canWrite()){
	print('Cannot write to file '+outfilename+', skipping.');
	return;
    }

    //////// Make the image
    var width=tileWidth(header.detail);
    var rows=Math.ceil(header.numberOfTiles/params.tilesPerRow);
    var cols=params.tilesPerRow;

    var imagewidth=(header.numberOfTiles<cols?header.numberOfTiles:cols);

    var tilesheet=new BufferedImage(width*imagewidth*params.scale,
				    width*rows*params.scale,
				    BufferedImage.TYPE_INT_ARGB);

    //////// Read the tiles and set the pixels
    for(var i=0;i<header.numberOfTiles;i++){
	var colors=readTile(filein,header.detail);

	colors=transformForTransparency(colors,width,params);

	var baseX=(i%cols)*width;
	var baseY=(Math.floor(i/cols))*width;

	if(params.scale==1){
	    for(var k=0;k<colors.length;k++){
		tilesheet.setRGB(baseX+Math.floor(k/width),
				 baseY+k%width,
				 colors[k]);
	    }
	}else{
	    for(var k=0;k<colors.length;k++){
		var startX=(baseX+Math.floor(k/width))*params.scale;
		var startY=(baseY+k%width)*params.scale;
		for(var x=0;x<params.scale;x++){
		    for(var y=0;y<params.scale;y++){
			tilesheet.setRGB(startX+x,
					 startY+y,
					 colors[k]);
		    }
		}
	    }
	}
    }

    //////// Actually write out the file
    ImageIO.write(tilesheet,'png',outfile);
}
