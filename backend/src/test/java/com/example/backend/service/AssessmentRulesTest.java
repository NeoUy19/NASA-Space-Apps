package com.example.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import com.example.backend.model.Status;
import java.util.List;
import org.junit.jupiter.api.Test;

class AssessmentRulesTest {

    // Average 97, standard deviation exactly 1: easy to reason about.
    private static final List<Double> STEADY_AROUND_97 = List.of(96.0, 98.0, 96.0, 98.0, 96.0, 98.0);

    // Never varies: standard deviation 0.
    private static final List<Double> ALWAYS_4 = List.of(4.0, 4.0, 4.0, 4.0, 4.0);

    @Test
    void bigDropFromBaselineIsAlert() {
        List<Double> history = List.of(97.0, 98.0, 96.0, 97.0, 98.0, 96.0);

        AssessmentRules.Result result = AssessmentRules.classify(92, history);

        assertEquals(Status.ALERT, result.status());
    }

    @Test
    void meanAndStandardDeviation() {
        assertEquals(97.0, AssessmentRules.mean(STEADY_AROUND_97), 0.0001);
        assertEquals(1.0, AssessmentRules.standardDeviation(STEADY_AROUND_97), 0.0001);
    }

    @Test
    void withinTwoStandardDeviationsIsNormal() {
        AssessmentRules.Result result = AssessmentRules.classify(98, STEADY_AROUND_97); // 1 away

        assertEquals(Status.NORMAL, result.status());
        assertEquals(97.0, result.baseline(), 0.0001);
    }

    @Test
    void betweenTwoAndThreeStandardDeviationsIsCaution() {
        AssessmentRules.Result result = AssessmentRules.classify(94.5, STEADY_AROUND_97); // 2.5 away

        assertEquals(Status.CAUTION, result.status());
    }

    @Test
    void moreThanThreeStandardDeviationsIsAlert() {
        AssessmentRules.Result result = AssessmentRules.classify(93, STEADY_AROUND_97); // 4 away

        assertEquals(Status.ALERT, result.status());
    }

    @Test
    void fewerThanFiveReadingsIsNormalWithNoBaseline() {
        AssessmentRules.Result result = AssessmentRules.classify(50, List.of(97.0, 98.0));

        assertEquals(Status.NORMAL, result.status());
        assertNull(result.baseline());
    }

    @Test
    void neverVariesAndChangedIsCaution() {
        AssessmentRules.Result result = AssessmentRules.classify(2, ALWAYS_4);

        assertEquals(Status.CAUTION, result.status());
    }

    @Test
    void neverVariesAndSameIsNormal() {
        AssessmentRules.Result result = AssessmentRules.classify(4, ALWAYS_4);

        assertEquals(Status.NORMAL, result.status());
    }
}
