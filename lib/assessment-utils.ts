import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { AssessmentResult } from '@/types/assessment';

export const generatePDF = (assessment: AssessmentResult) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Add header
    doc.setFontSize(20);
    doc.text('FriendScope Assessment Report', pageWidth / 2, 20, { align: 'center' });

    // Add basic information
    doc.setFontSize(12);
    doc.text(`Date: ${format(new Date(assessment.date), 'MMMM d, yyyy')}`, 20, 40);
    doc.text(`Friend: ${assessment.friendName}`, 20, 50);
    doc.text(`Overall Score: ${Math.round(assessment.overallScore)}%`, 20, 60);

    // Add assessment message
    doc.setFontSize(14);
    doc.text('Assessment', 20, 80);
    doc.setFontSize(12);
    doc.text(assessment.assessment.message, 20, 90);
    doc.text(assessment.assessment.recommendation, 20, 100);

    // Add category scores
    doc.setFontSize(14);
    doc.text('Category Scores', 20, 120);
    doc.setFontSize(12);

    let yPosition = 130;
    Object.entries(assessment.categoryScores).forEach(([category, score]) => {
        if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
        }
        doc.text(`${category}: ${Math.round(score)}%`, 20, yPosition);
        yPosition += 10;
    });

    // Add notes if any
    if (assessment.notes) {
        yPosition += 10;
        if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
        }
        doc.setFontSize(14);
        doc.text('Notes', 20, yPosition);
        doc.setFontSize(12);
        doc.text(assessment.notes, 20, yPosition + 10);
    }

    // Add footer
    doc.setFontSize(10);
    doc.text('Generated by FriendScope', pageWidth / 2, 280, { align: 'center' });

    // Save the PDF
    doc.save(`FriendScope-Assessment-${assessment.friendName}-${format(new Date(assessment.date), 'yyyy-MM-dd')}.pdf`);
};

export const shareAssessment = async (assessment: AssessmentResult) => {
    const shareData = {
        title: 'FriendScope Assessment Results',
        text: `Check out my friendship assessment with ${assessment.friendName}! Overall Score: ${Math.round(assessment.overallScore)}%`,
        url: window.location.href
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error sharing:', error);
        return false;
    }
};
