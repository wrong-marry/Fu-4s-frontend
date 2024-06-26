
import * as yup from 'yup';

export const subjectSchema = yup.object().shape({
  code: yup.string().required('Code is required').min(3, 'Code must be at least 3 characters'),
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  semester: yup.number().required('Semester is required').min(1, 'Semester must be at least 1').max(9, 'Semester must be no more than 9'),
});