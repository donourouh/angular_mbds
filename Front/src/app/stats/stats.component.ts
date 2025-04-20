import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AssignmentsService } from '../shared/assignments.service';
import { Chart } from 'chart.js/auto';
import { Assignment } from '../assignments/assignment.model';


@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  totalAssignments: number = 0;
  rendusPercentage: number = 0;
  averageNote: number = 0;
  nonRendusCount: number = 0;
  chart: any;

  constructor(private assignmentsService: AssignmentsService) { }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats() {
    this.assignmentsService.getAssignmentsPagines(1, 1000).subscribe((data: any) => {
      const assignments: Assignment[] = data.docs;
      this.totalAssignments = assignments.length;
      
      const rendus = assignments.filter((a: Assignment) => a.rendu).length;
      this.rendusPercentage = Math.round((rendus / this.totalAssignments) * 100);
      
      const notes = assignments
        .filter((a: Assignment) => a.rendu && typeof a.note === 'number')
        .map((a: Assignment) => a.note as number);
      
      this.averageNote = notes.length > 0 
        ? Math.round((notes.reduce((a: number, b: number) => a + b, 0) / notes.length) * 10) / 10 
        : 0;
      
      const now = new Date();
      this.nonRendusCount = assignments
        .filter((a: Assignment) => !a.rendu && new Date(a.dateDeRendu) < now).length;

      const matiereStats = assignments.reduce((acc: {[key: string]: number}, curr: Assignment) => {
        const matiere = curr.matiere?.nom ?? 'Non assigné';
        acc[matiere] = (acc[matiere] || 0) + 1;
        return acc;
      }, {});

      this.createChart(matiereStats);
    });
  }

  createChart(matiereStats: {[key: string]: number}) {
    const ctx = document.getElementById('matiereChart') as HTMLCanvasElement;
    
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(matiereStats),
        datasets: [{
          label: 'Nombre de devoirs',
          data: Object.values(matiereStats),
          backgroundColor: [
            '#FF6642', // Couleur principale
            '#FF8066', // Plus clair
            '#FF9A8A', // Encore plus clair
            '#FFB4A8', // Très clair
            '#E65B3B', // Plus foncé
            '#CC5035'  // Encore plus foncé
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#ffffff'
            }
          },
          title: {
            display: true,
            text: 'Répartition des devoirs par matière',
            color: '#ffffff',
            font: {
              size: 16
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#ffffff'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          x: {
            ticks: {
              color: '#ffffff'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        }
      }
    });
  }
}
