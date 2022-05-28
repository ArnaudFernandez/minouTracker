import { Component, OnInit } from '@angular/core';
import {ServiceIntakeService} from "../../../service-intake.service";
import {ActivatedRoute} from "@angular/router";
import {TeamMembers} from "../../../class/team-members";
import {Intakes} from "../../../class/intakes";
import {User} from "../../../class/user";

@Component({
  selector: 'app-team-tracker-progress',
  templateUrl: './team-tracker-progress.component.html',
  styleUrls: ['./team-tracker-progress.component.scss']
})
export class TeamTrackerProgressComponent implements OnInit {

  teamId?: string = undefined
  teamMembers?: User[] = [];

  constructor(public serviceIntake: ServiceIntakeService,
              public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.teamId = this.route.snapshot.paramMap.get('id') as string;
    // First we get all team members
    this.serviceIntake.getTeamMembersWithTeamId(this.teamId).subscribe(teamMembers => {
      // Then for each team member ...
      teamMembers.forEach(teamMember => {
        // We get his profile
        this.serviceIntake.getUserByUid(teamMember.memberUid as string).subscribe(user => {
          const userFound = user[0];
          // His profile being here, we can get his intakes now
          this.serviceIntake.getAllIntakesDocumentsByUid(teamMember.memberUid as string).subscribe(intakes => {
            const currentUserIntakes: Intakes[] = [];
            // And only keeping todays intakes
            intakes.forEach(intakeDoc => {
              intakeDoc.dateFormatted = intakeDoc.date.toDate();
              // @ts-ignore
              if (intakeDoc.dateFormatted.getDate() === new Date().getDate()
                && intakeDoc.dateFormatted.getMonth() === new Date().getMonth()
                && intakeDoc.dateFormatted.getFullYear() === new Date().getFullYear()
              ) {
                currentUserIntakes.push(intakeDoc);
              }
            });

            // This monstruosity is updating in real time when someone is on the page
            // And a member is updating his intaked, before it would have added another line
            // Which is false, now it updates if it's already on a list
            // IT IS NOT OPTIMAL AT ALL but hey it works, you know.
            let indexOfMemberIfAlreadyInList = -1;
            for (let i = 0; i < (this.teamMembers as User[]).length; i++){
              if ((this.teamMembers as User[])[i].uid === userFound.uid) {
                indexOfMemberIfAlreadyInList = i;
              }
            }
            if (indexOfMemberIfAlreadyInList !== -1) {
              (this.teamMembers as User[])[indexOfMemberIfAlreadyInList] = {
                ...userFound,
                intakes:currentUserIntakes
              }
            } else {
              (this.teamMembers as User[]).push({
                ...userFound,
                intakes: currentUserIntakes
              });
            }
          })
        })
      })
    })
  }

  getTotalCurrentIntakesFromSelectedUser(intakes: Intakes[] | undefined): number {
    if (intakes) {
      let total = 0;
      intakes.forEach(intake => {
        total += intake.intakeValue;
      });
      return total;
    }
    return 0;
  }

  getValueForUser(user: User): number {
    const currentTotalIntakes = this.getTotalCurrentIntakesFromSelectedUser(user.intakes);

    return (currentTotalIntakes / (user.targetIntake as number) * 100);
  }
}
