import { motion } from 'https://unpkg.com/framer-motion/dist/framer-motion.umd.js';
const e = React.createElement;

const transcriptData = [
  {courseNo: '1006001', title: 'ENGINEERING MATHEMATICS 1', credit: 3, grade: ''},
  {courseNo: '1006010', title: 'ENGINEERING MECHANICS', credit: 3, grade: ''},
  {courseNo: '1006012', title: 'COMPUTER PROGRAMMING', credit: 3, grade: ''},
  {courseNo: '1006015', title: 'ENGINEERING DRAWING', credit: 3, grade: ''},
  {courseNo: '1006020', title: 'GENERAL PHYSICS 1', credit: 3, grade: ''},
  {courseNo: '1006021', title: 'GENERAL PHYSICS LABORATORY 1', credit: 1, grade: ''},
  {courseNo: '1006024', title: 'GENERAL CHEMISTRY', credit: 3, grade: ''},
  {courseNo: '90641007', title: 'DIGITAL CITIZEN', credit: 3, grade: ''},
  {courseNo: '90641008', title: 'INTRODUCTION TO ENGLISH COMMUNICATION SKILLS', credit: 0, grade: ''},
  {courseNo: '90642036', title: 'PRE-ACTIVITIES FOR ENGINEERS', credit: 1, grade: ''}
];

function Transcript() {
  return e('div', {className: 'container'},
    e('h1', null, 'Transcript - Mr. Naphat Panyo'),
    e('table', null, 
      e('thead', null, 
        e('tr', null, ['Course No', 'Course Title', 'Credit', 'Grade'].map(h => e('th', null, h)))
      ),
      e('tbody', null, transcriptData.map(c => e(motion.tr, {initial: {opacity:0, y:-10}, animate: {opacity:1, y:0}, transition:{duration:0.3}},
        e('td', null, c.courseNo),
        e('td', null, c.title),
        e('td', null, c.credit),
        e('td', null, c.grade)
      )))
    ),
    e('div', {style:{marginTop:'20px'}},
      e('button', {onClick:()=>window.print()}, 'Print Transcript')
    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(e(Transcript));
