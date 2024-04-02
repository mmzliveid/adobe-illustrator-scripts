function getPngOptions(scaleType, scaleTypeValue) {
  var options = new ExportForScreensOptionsPNG24();
  options.antiAliasing = AntiAliasingMethod.ARTOPTIMIZED;
  options.transparency = true;
  options.scaleType = scaleType;
  options.scaleTypeValue = scaleTypeValue;

  return options;
}

// function getJpegOptions(scaleType, scaleTypeValue) {
//   var options = new ExportForScreensOptionsJPEG();
//   options.antiAliasing = AntiAliasingMethod.ARTOPTIMIZED;
//   // options.antiAliasing = AntiAliasingMethod.None;
//   options.compressionMethod = JPEGCompressionMethodType.BASELINESTANDARD;
//   // options.compressionMethod = JPEGCompressionMethodType.PROGRESSIVE;
//   // options.progressiveScan = 4;
//   options.embedICCProfile = true;
//   options.scaleType = scaleType;
//   options.scaleTypeValue = scaleTypeValue;

//   return options;
// }

// function getSvgOptions() {
//   var options = new ExportForScreensOptionsWebOptimizedSVG();
//   options.coordinatePrecision = 3;
//   options.cssProperties = SVGCSSPropertyLocation.ENTITIES;
//   options.fontType = SVGFontType.OUTLINEFONT;
//   options.rasterImageLocation = RasterImageLocation.EMBED;
//   options.svgId = SVGIdType.SVGIDREGULAR;
//   options.svgMinify = false;
//   options.svgResponsive = true;

//   return options;
// }

// function getPdfOptions() {
//   var options = new ExportForScreensPDFOptions();
//   options.pdfPreset = '[Press Quality]';

//   return options;
// }

function main() {
  if (parseFloat(app.version) < 15) {
    return;
  }

  if (app.documents.length === 0) {
    return;
  }

  var doc = app.activeDocument;

  if (doc.artboards.length === 0) {
    return;
  }

  var userInteractionLevel = app.userInteractionLevel;
  app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

  var exportFolder = new Folder(
    doc.path + '/dist/' + doc.name.replace(/\.ai$/i, '') + '/'
  );

  if (!exportFolder.exists) {
    exportFolder.create();
  }

  for (i = 0; i < doc.artboards.length; i++) {
    var artboardName = doc.artboards[i].name;
    if (!artboardName || artboardName.indexOf('_') < 1) {
      continue;
    }

    var nameParts = artboardName.split('_');
    if (nameParts.length !== 2) {
      continue;
    }

    var prefix = nameParts[0];
    var sizeParts = nameParts[1].split('-');

    if (sizeParts.length === 0) {
      continue;
    }

    // doc.artboards.setActiveArtboardIndex(i);
    var itemToExport = new ExportForScreensItemToExport();
    // itemToExport.artboards = 'all';
    itemToExport.artboards = '' + (i + 1) + '';
    itemToExport.document = false;

    for (j = 0; j < sizeParts.length; j++) {
      var scaleValue = Number(sizeParts[j]);

      try {
        doc.artboards[i].name = prefix + '-' + scaleValue;

        doc.exportForScreens(
          exportFolder,
          ExportForScreensType.SE_PNG24,
          getPngOptions(
            // ExportForScreensScaleType.SCALEBYFACTOR
            // ExportForScreensScaleType.SCALEBYRESOLUTION
            // ExportForScreensScaleType.SCALEBYWIDTH
            ExportForScreensScaleType.SCALEBYWIDTH,
            scaleValue
          ),
          itemToExport
        );
      } finally {
        doc.artboards[i].name = artboardName;
      }
    }
  }

  app.userInteractionLevel = userInteractionLevel;

  alert('Export complete.');
}

main();
