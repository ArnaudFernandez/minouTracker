import { Component, OnInit } from '@angular/core';
import {ServiceIntakeService} from "../../service-intake.service";
import {Teams} from "../../class/teams";
import {User} from "../../class/user";
import {TeamMembers} from "../../class/team-members";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  templateUrl: './team-tracker.component.html',
  styleUrls: ['./team-tracker.component.scss']
})
export class TeamTrackerComponent implements OnInit {

  userTeams?: TeamMembers[] = undefined;
  teams: Teams[] = [];

  createTeamFormGroup: FormGroup = new FormGroup({
    teamName: new FormControl('', Validators.minLength(1))
  })

  constructor(public serviceIntakes: ServiceIntakeService) {
  }

  ngOnInit(): void {
    this.getTeamsFromConnectedUser();
  }

  resetAllForms(): void {
    this.createTeamFormGroup.reset({
      teamName: ''
    });
  }

  ajouterEquipe(): void {
    if (!this.createTeamFormGroup.invalid) {
      this.serviceIntakes.addNewTeam(this.createTeamFormGroup.value.teamName);
      this.getTeamsFromConnectedUser();
      this.resetAllForms();
    }
  }

  getTeamsFromConnectedUser(): void {
    this.serviceIntakes.getAllTeamsForUser()?.subscribe(value => {
      value.forEach(teamThatUserHave => {
        this.serviceIntakes.getTeamFromOwnerId(teamThatUserHave.ownerUid as string)?.subscribe(team => {
          this.teams = team;
        })
      })
      this.userTeams = value;
    })
  }
}
