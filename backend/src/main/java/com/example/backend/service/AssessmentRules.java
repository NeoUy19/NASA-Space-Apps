package com.example.backend.service;
import java.util.List;
import com.example.backend.model.*;
public class AssessmentRules {
    public record  Result(Status status, Double baseline, String reason) {
}
    public static double mean(List<Double> values){
        double sum = 0;
        for (Double val : values){
            sum += val;
        }
        return sum/values.size();
    }

    public static  double standardDeviation(List<Double> values){
        double avg = mean(values);
        double sum = 0;
        for (Double val : values){
            sum += Math.pow((val - avg), 2);
        }
        return  Math.sqrt(sum/values.size());
    }

    public static Result classify(double latestVal,List<Double> values){
        Status status;
        if (values.size() < 5){
            return new Result(Status.NORMAL, null, "Currently building your baseline: " + values.size() + " of 5 readings so far");
        }
        double avg = mean(values);
        double std = standardDeviation(values);
        if (std == 0 ){
            if (latestVal == avg){
                status = Status.NORMAL;
            }
            else {
                status = Status.CAUTION;
            }
            return new Result (status,avg, (latestVal == avg ? "Same as your usual reading of " + String.format("%.1f",avg) :  String.format("%.1f",avg) + " is your usual reading, today is " + String.format("%.1f",latestVal)));
        }
        double stdFromAvg = Math.abs(avg - latestVal)/std;
        if (stdFromAvg > 3){
            status = Status.ALERT;
        }
        else if (stdFromAvg > 2){
            status = Status.CAUTION;
        }
        else{
            status = Status.NORMAL;
        }
        return new Result(status, avg, latestVal + " is " + (latestVal > avg ? "above " : (latestVal == avg ? "equal to " : "below ")) + "your recent average of " + String.format("%.1f",avg));
    }
}
