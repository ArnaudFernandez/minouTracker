import { Component } from '@angular/core';
import {SwUpdate} from "@angular/service-worker";
import {FlatTreeControl} from "@angular/cdk/tree";
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {Router, RouterOutlet} from '@angular/router';

/** Flat node with expandable and level information */
interface MenuNode {
  expandable: boolean;
  name: string;
  level: number;
}

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface MenuNode {
  name: string;
  children?: MenuNode[];
  navigateUrl?: string;
  isPerson?: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'foodTrackingApp';

  private _transformer = (node: MenuNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      isPerson: node.isPerson,
      navigateUrl: node.navigateUrl,
      level: level,
    };
  };

  menuContent: any[] = [
    {
      name: 'Personnes',
      children: [{name: 'Arnaud', navigateUrl: 'home', isPerson: true}, {name: 'Laura', navigateUrl: 'home', isPerson: true}],
    },
    {
      name: 'Tracker',
      children: [{name: 'Tracking du jour', navigateUrl: 'tracker'}],
    },
    {
      name: 'Statistiques',
      children: [{name: 'Evolution poids', navigateUrl: 'statistiques'}],
    }
  ];

  treeControl = new FlatTreeControl<MenuNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children,
  );

  // @ts-ignore
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: MenuNode) => node.expandable;

  selectedPerson?: string = undefined;
  routing: Router;

  constructor(updates: SwUpdate,
              routing: Router) {
    updates.available.subscribe(event => {
      updates.activateUpdate().then( _ => {document.location.reload()});
    })
    this.dataSource.data = this.menuContent;
    this.routing = routing;
  }

  menuButtonClicked(node: MenuNode): void {
    console.log(node);
    if (node.isPerson) {
      this.selectedPerson = node.name
      this.routing.navigate([`${node.navigateUrl}`])
    } else {
      this.routing.navigate([`${node.navigateUrl}`])
    }
  }
}
