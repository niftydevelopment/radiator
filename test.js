var report = require('./report.js');
var colors = require('colors');

var chefen = false;

var runit = function() {
  report.generate([{"id":"2016-12-05_16-07-29","user":"llan","msg":"uppdaterat pom med ny version 7.1.0-SNAPSHOT\ncr: mkalk","date":"2016-12-05T14:41:49.306238Z","formattedDate":"20161205144149306238","result":"SUCCESS"},{"id":"2016-12-05_14-04-52","user":"fwin","msg":"PCAP-15368, uppdaterat lantbruksföretaginfo och produktionsplatsinfo till v3.0.0.R resp. v2.0.1.R.\n\nCR: Mikhail","date":"2016-12-05T12:35:03.263112Z","formattedDate":"20161205123503263112","result":"SUCCESS"},{"id":"2016-12-05_13-18-49","user":"rjans","msg":"PCAP-16945, Ändra namn från FastställdAreal till KonstateradAreal, beräkna kolumnerna KonstateradAreal, AvvikelseAreal och AvvikelseAndel, tag bort kolumnen ArealAvvikelse.\nCR esvel","date":"2016-12-05T12:02:17.993528Z","formattedDate":"20161205120217993528","result":"SUCCESS"},{"id":"2016-12-06_17-02-05","user":"esvel","msg":"Merged revision(s) 119479-119700, 117063-119482 from system/kontroll/atlas/trunk","date":"2016-12-06T14:46:04.203459Z","formattedDate":"20161206144604203459","result":"SUCCESS"},{"id":"2016-12-06_18-08-12","user":"esvel","msg":"Fix för reintegrate merge","date":"2016-12-06T16:57:16.105503Z","formattedDate":"20161206165716105503","result":"SUCCESS","coverage":67.3,"formattedCoverage":"67.3%"}]);
}

runit();




