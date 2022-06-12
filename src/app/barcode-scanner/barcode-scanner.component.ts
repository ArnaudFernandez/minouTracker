import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {BarcodeScannerLivestreamComponent} from "ngx-barcode-scanner";
import {SnackbarComponent} from "../shared/snackbar/snackbar.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.scss']
})
export class BarcodeScannerComponent implements OnInit, AfterViewInit {

  @ViewChild(BarcodeScannerLivestreamComponent)
  barcodeScanner: BarcodeScannerLivestreamComponent | undefined;

  barcodeValue? = undefined;

  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.barcodeScanner?.start();
  }

  onValueChanges(result: any) {
    this.barcodeValue = result.codeResult.code;

    this._snackBar.openFromComponent(SnackbarComponent, {
      duration: 5 * 1000,
      data: {
        text: 'Code : ' + this.barcodeValue
      }
    });
  }

  onStarted(started: any) {
    console.log(started);
  }
}
