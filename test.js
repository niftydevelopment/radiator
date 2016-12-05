var poll = require('./poll.js');
var savedata = require('./savedata.js');
var report = require('./report.js');
var colors = require('colors');

var chefen = false;

var runit = function() {
  report.generate([{"id":"2016-12-02_17-05-09","user":"esvel","msg":"PCAP-16232 Källreferens sätts felaktigt på Åtagandeytor. Måste köra om DDÄ UppdateraKontrollytaReferenser600 som konsekvens av att ytor kan ha fått fel referenser.","date":"2016-12-02T16:04:32.205922Z","result":'FAIL'},{"id":"2016-12-02_16-35-09","user":"lkzt","msg":"PCAP-16232 - Tar bort blockIDt som tidgare lagts till åtagandes sourceRef. cr: eje/dsin","date":"2016-12-02T15:30:56.298785Z","result":"SUCCESS"},{"id":"2016-12-02_16-20-09","user":"fwin","msg":"PCAP-????, uppdaterat postman collection\n\nCR: :()-|-<","date":"2016-12-02T15:19:56.204538Z","result":"SUCCESS"},{"id":"2016-12-02_15-50-09","user":"fwin","msg":"PCAP-16945, fixat så att datumet då DDÄ kördes som uppdaterar arsresultatprojectionen visas i gui.\n\nCR: demas","date":"2016-12-02T14:41:23.516631Z","result":"SUCCESS"},{"id":"2016-12-02_14-05-08","user":"llan","msg":"PCAP-14857 Fel uppgift i CDB protokoll justerat rapporterande ppn\ncr: esvel","date":"2016-12-02T13:01:10.033225Z","result":"SUCCESS"},{"id":"2016-12-02_13-35-08","user":"lkzt","msg":"PCAP-16967 - Går nu att skapa prorokoll för får, get och gris. CR: dsin","date":"2016-12-02T12:33:40.126635Z","result":"SUCCESS"}]);
}

runit();



