const Header = (props) => {
	return (
		<>
			<h2>{props.course.name}</h2>
		</>
	)
}
const Part = (props) => {
	return (
		<p>
			{props.name} {props.exercises}
		</p>
	)
}
const Content = (props) => {
	return  (
		<>
		{
			props.course.parts.map( part => <Part key={part.id} name={part.name} exercises = {part.exercises} /> )
		}
		</>
	)
}
const Total = (props) =>{
	const total = props.course.parts.reduce((cur, part) => {
		return cur + part.exercises
	}, 0)
	return (
		<p><b> total of {total} exercises </b></p>
	)
}
const Course = (props) => {
  return (
    <div>
			<Header course={props.course} />
			<Content course={props.course} />
			<Total course={props.course} />
    </div>
  )	
}

export default Course
