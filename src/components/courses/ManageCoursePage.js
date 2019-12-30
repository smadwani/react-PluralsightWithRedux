import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { loadCourses, saveCourse } from "../../redux/actions/CourseActions";
import { loadAuthors } from "../../redux/actions/AuthorAcrions";
import { newCourse } from "../../../tools/mockData";
import CourseForm from "../courses/CourseForm";
import Spinner from "../common/Spinner";
import { toast } from "react-toastify";

function ManageCoursePage({
  courses,
  authors,
  loadCourses,
  loadAuthors,
  saveCourse,
  history,
  ...props
}) {
  const [course, setCourse] = useState({ ...props.course });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  function formIsValid() {
    const { title, category, authorId } = course;
    const errors = {};
    if (!title) errors.title = "Title is required";
    if (!category) errors.category = "Category is required";
    if (!authorId) errors.author = "Author is required";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setCourse(prevState => ({
      ...prevState,
      [name]: name === "authorId" ? parseInt(value, 10) : value
    }));
  }

  function handleSave(event) {
    event.preventDefault();
    if (!formIsValid()) return;
    setSaving(true);
    saveCourse(course)
      .then(() => {
        toast.success("course saved.");
        history.push("/courses");
      })
      .catch(error => {
        setSaving(false);
        setErrors({ onSave: error.message });
      });
  }

  useEffect(() => {
    if (courses.length === 0) {
      loadCourses().catch(error => {
        alert("some issue loading course data" + error);
      });
    } else {
      setCourse(props.course);
    }
    if (authors.length === 0) {
      loadAuthors().catch(error => {
        alert("some issue loading author data" + error);
      });
    }
  }, [props.course]);

  return courses.length == 0 || authors.length == 0 ? (
    <Spinner />
  ) : (
    <CourseForm
      course={course}
      authors={authors}
      errors={errors}
      onChange={handleChange}
      onSave={handleSave}
      saving={saving}
    />
  );
}

ManageCoursePage.propTypes = {
  course: PropTypes.object.isRequired,
  courses: PropTypes.array.isRequired,
  authors: PropTypes.array.isRequired,
  loadCourses: PropTypes.func.isRequired,
  saveCourse: PropTypes.func.isRequired,
  loadAuthors: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  const slug = ownProps.match.params.slug;
  return {
    course:
      slug && state.courses.length > 0
        ? state.courses.find(c => c.slug === slug)
        : newCourse,
    courses: state.courses,
    authors: state.authors,
    loading: state.apiCallsInProgress > 0
  };
}

const mapDispatchToProps = {
  loadCourses,
  loadAuthors,
  saveCourse
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursePage);
