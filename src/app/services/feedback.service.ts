import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Feedback, Question, FeedbackQuestion, DoctorRating, DoctorAVgRating } from '../models/appoitment-models/IFeedback';
import { appointmentServiceUrl } from '../Shared/apiUrls';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  selectedid:number=0;
  selectedviewid:number=0;
constructor(private http:HttpClient){}
appointmentServiceUrl:string="https://localhost:44327/"
getData(id:number): Observable<Feedback> {
  
  return this.http.get<Feedback>(this.appointmentServiceUrl+"api/Feedback/${id}");
}
postData(obj:Feedback):Observable<Feedback>{

  return this.http.post<Feedback>(this.appointmentServiceUrl+"api/Feedback",obj);
  
}
getQuestions():Observable<FeedbackQuestion[]>{
  return this.http.get<FeedbackQuestion[]>(this.appointmentServiceUrl+"api/FeedbackQuestions");
}
getAllFeedback():Observable<Feedback[]>{
  return this.http.get<Feedback[]>(this.appointmentServiceUrl+"api/Feedback");
}
PostAvgRating(obj:DoctorRating):Observable<DoctorRating>{
  return this.http.post<DoctorRating>(this.appointmentServiceUrl+"api/DoctorRatings",obj)
}
getAvgRating():Observable<DoctorAVgRating[]>{
  return this.http.get<DoctorAVgRating[]>(this.appointmentServiceUrl+"api/DoctorRatings/DoctorAverageRating")
}
// getQuestionsRating(obj:FeedbackQuestion[]):Question[]{
  
//   const questions: Question[] = [
//     { QuestionId: 1, FeedbackQuestionId: 0, Rating: 0 },
//     { QuestionId: 2, FeedbackQuestionId: 0, Rating: 0 },
//     { QuestionId: 3, FeedbackQuestionId: 0, Rating: 0 }
// ];
// for (let i = 0; i < questions.length; i++) {
//   questions[i].FeedbackQuestionId = obj[i].FeedbackQuestionId;
// }
// return questions;
// }
}