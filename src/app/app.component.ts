import {Component, OnInit} from '@angular/core';
import {SwUpdate} from "@angular/service-worker";
import {FlatTreeControl} from "@angular/cdk/tree";
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {Router} from '@angular/router';
import {AuthGuard} from './shared/guard/auth.guard';
import {User} from './class/user';

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
export class AppComponent implements OnInit {

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
      name: 'Tracker',
      children: [{name: 'Tracking du jour', navigateUrl: 'tracker'}, {name: 'Team tracking', navigateUrl: 'teamTracking'}],
    },
    {
      name: 'Historique',
      children: [{name: 'Tracking du jour', navigateUrl: 'history'}],
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
  connectedUser?: User;

  constructor(updates: SwUpdate,
              public authGuard: AuthGuard,
              routing: Router) {
    updates.available.subscribe(event => {
      updates.activateUpdate().then(_ => {
        document.location.reload()
      });
    })
    this.dataSource.data = this.menuContent;
    this.routing = routing;

  }

  ngOnInit() {
    if (!this.authGuard.isUserLoggedIn()) {
      this.routing.navigate(['authentication']);
    }
    this.setUserIfNotSet();
  }

  setUserIfNotSet() {
    if (this.authGuard.isUserLoggedIn() && this.connectedUser === undefined && localStorage.getItem('user') !== undefined) {
      const userJson = JSON.parse(localStorage.getItem('user') as string);
      this.connectedUser = {
        uid: userJson?.uid,
        email: userJson?.email,
        displayName: userJson?.displayName,
        photoURL: userJson?.photoURL,
        emailVerified: userJson?.emailVerified
      }
    }
  }

  disconnect(): void {
    this.authGuard.disconnect();
  }

  menuButtonClicked(node: MenuNode): void {
    if (node.isPerson) {
      this.selectedPerson = node.name
      this.routing.navigate([`${node.navigateUrl}`])
    } else {
      this.routing.navigate([`${node.navigateUrl}`])
    }
  }
}
