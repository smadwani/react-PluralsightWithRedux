import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { loadCourses, deleteCourse } from "../../redux/actions/CourseActions";
import { loadAuthors } from "../../redux/actions/AuthorAcrions";
import CourseList from "./CourseList";
import { Redirect } from "react-router-dom";
import Spinner from "../common/Spinner";
import { toast } from "react-toastify";

class CoursePage extends Component {
  state = {
    redirectToAddCoursePage: false
  };

  componentDidMount() {
    const { courses, authors, loadCourses, loadAuthors } = this.props;
    debugger;
    if (courses.length === 0) {
      loadCourses().catch(error => {
        alert("some error loading courses" + error);
      });
    }

    if (authors.length === 0) {
      loadAuthors().catch(error => {
        alert("some error loading authors" + error);
      });
    }
  }

  handleDeleteCourse = course => {
    debugger;
    toast.success("course deleted");
    this.props.deleteCourse(course).catch(error => {
      toast.error("Delete failed. " + error.message, { autoClose: false });
    });
  };

  render() {
    return (
      <>
        {this.state.redirectToAddCoursePage && <Redirect to="/course" />}
        <h1>Courses</h1>
        {this.props.loading ? (
          <Spinner />
        ) : (
          <>
            <button
              style={{ marginBottom: 20 }}
              className="btn btn-primary add-course"
              onClick={() => this.setState({ redirectToAddCoursePage: true })}
            >
              Add Course
            </button>

            <CourseList
              courses={this.props.courses}
              authors={this.props.authors}
              onDelete={this.handleDeleteCourse}
            />
          </>
        )}
      </>
    );
  }
}

CoursePage.propTypes = {
  courses: PropTypes.array.isRequired,
  authors: PropTypes.array.isRequired,
  loadCourses: PropTypes.func.isRequired,
  loadAuthors: PropTypes.func.isRequired,
  deleteCourse: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    courses:
      state.authors.length == 0
        ? []
        : state.courses.map(course => {
            return {
              ...course,
              authorName: state.authors.find(a => a.id === course.authorId).name
            };
          }),
    authors: state.authors,
    loading: state.apiCallsInProgress > 0
  };
}

const mapDispatchToProps = {
  loadCourses,
  loadAuthors,
  deleteCourse
};

export default connect(mapStateToProps, mapDispatchToProps)(CoursePage);
