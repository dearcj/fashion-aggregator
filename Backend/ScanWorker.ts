/**
 * Created by MSI on 28.08.2016.
 */


export class ScanWorker {
  checkInterval:number = 5000;//5 /*mins*/ *60*1000;

  bigScanPages:number = 20;
  scanPages:number = 1;

  betweenScanDelay:number = 5000;


  bigScanInterval:number = 5 /*days*/ * 24 * 60 * 60 * 1000;
  scanInterval:number = 12 /*hrs*/ * 60 * 60 * 1000;
  qf:(q:string, params:Array<Object>, cv:Function) => void;


  updateLink(link) {

    this.qf('update link set scan_date = $1, big_scan_date = $2  where id = $3 ', [link.scan_date, link.big_scan_date, link.id], function res(e, r) {
      console;
    }.bind(this));
  }

  scanLink(link) {
    var isBigScan = false;

    if (!link.big_scan_date || link.big_scan_date.getMilliseconds() > new Date().getMilliseconds() - this.bigScanInterval) {
      isBigScan = true;
    }

    var pages = this.scanPages;
    if (isBigScan) {
      pages = this.bigScanPages;
      link.big_scan_date = new Date();
    }
    link.scan_date = new Date();

    this.updateLink(link)
  }

  check() {
    this.qf('SELECT *  from link where scan_date is null OR scan_date > $1', [new Date().getMilliseconds() - this.scanInterval], function res(e, r) {
      if (r)
        for (var i = 0, ln = r.length; i < ln; ++i) {
          setTimeout(this.scanLink.bind(this, r[i]), this.betweenScanDelay * i)
        }
    }.bind(this));
  }

  constructor(queryFunction:(q:string, params:Array<Object>, cv:Function) => void) {
    this.qf = queryFunction;
    setInterval(this.check.bind(this), this.checkInterval);
  }
}
