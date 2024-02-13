import React, { Component } from "react";
import "./PositionTable.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import { Button } from "react-bootstrap";


import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";


const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

class PositionTable extends Component {
  state = {
    positionData: [],
    loading: true,

    columnDefs: [

      {
        headerName: "Company",
        field: "CompanyName",
        sortable: true,
        // width: 150,
        // filter: true ,
      },

      {
        headerName: "Position",
        field: "PositionName",
        sortable: true,
        // width: 150,
        // filter: true ,
      },



      {
        headerName: "",
        field: "edit",
        filter: false,
        width: 30,
        cellRendererFramework: this.renderEditButton.bind(this)
      },
      {
        headerName: "",
        field: "delete",
        filter: false,
        width: 30,
        cellRendererFramework: this.renderButton.bind(this)
      }
    ],
    rowData: [],
    defaultColDef: {
      resizable: true,
      width: 590,
      filter: "agTextColumnFilter"
      // filter: true ,
    },
    getRowHeight: function (params) {
      return 35;
    }

  };
  positionObj = [];
  rowDataT = [];

  loadPositionData = () => {
    axios
      .get("http://localhost:4000/api/position", {
        headers: {
          authorization: localStorage.getItem("token") || ""
        }
      })
      .then(response => {
        this.positionObj = response.data;
        console.log("response", response.data);
        this.setState({ positionData: response.data });
        this.setState({ loading: false });
        this.rowDataT = [];

        this.positionObj.map(data => {
          let temp = {
            data,
            CompanyName: data["company"][0]["CompanyName"],
            PositionName: data["PositionName"],

          };

          this.rowDataT.push(temp);
        });
        this.setState({ rowData: this.rowDataT });
      })
      .catch(error => {
        console.log(error);
      });
  };

  onPositionDelete = e => {
    console.log(e);
    if (window.confirm("Are you sure to delete this record ? ") == true) {
      axios
        .delete("http://localhost:4000/api/position/" + e, {
          headers: {
            authorization: localStorage.getItem("token") || ""
          }
        })
        .then(res => {
          this.componentDidMount();
        })
        .catch(err => {
          console.log(err);
          console.log(err.response);
          if (err.response.status == 403) {
            window.alert(err.response.data);
          }

        });
    }
  };
  componentDidMount() {
    this.loadPositionData();
  }
  renderButton(params) {
    console.log(params);
    return (
      <FontAwesomeIcon
        icon={faTrash}
        onClick={() =>
          this.onPositionDelete(params.data.data["_id"])
        }
      />
    );
  }
  renderEditButton(params) {
    console.log(params);
    return (
      <FontAwesomeIcon
        icon={faEdit}
        onClick={() => this.props.onEditPosition(params.data.data)}
      />
    );
  }

  render() {
    return (
      <div id="table-outer-div-scroll">
        <h2 id="role-title">Position Details</h2>

        <Button
          variant="primary"
          id="add-button"
          onClick={this.props.onAddPosition}
        >
          <FontAwesomeIcon icon={faPlus} id="plus-icon" />
          Add
        </Button>
        <div id="clear-both" />
        {!this.state.loading ? (
          <div
            id="table-div"
            className="ag-theme-balham"
          //   style={
          //     {
          //     height: "500px",
          //     width: "100%"
          //   }
          // }
          >
            <AgGridReact
              columnDefs={this.state.columnDefs}
              defaultColDef={this.state.defaultColDef}
              columnTypes={this.state.columnTypes}
              rowData={this.state.rowData}
              // floatingFilter={true}
              // onGridReady={this.onGridReady}
              pagination={true}
              paginationPageSize={10}
              getRowHeight={this.state.getRowHeight}
            />
          </div>
        ) : (
            <div id="loading-bar">
              <RingLoader
                css={override}
                sizeUnit={"px"}
                size={50}
                color={"#0000ff"}
                loading={true}
              />
            </div>
          )}
        {/* <div id="inner-table-div">
          <table id="role-table">
            <thead>
            <tr>
                <th width="30%">Company</th>
                <th width="30%">Position</th>
                <th width="20%" />
                <th width="20%" />
              </tr>
            </thead>

            {!this.state.loading ? (
              <tbody>
                {this.positionObj.map((data, index) => (
                  <tr key={index}>
                    <td>{data["company"][0]["CompanyName"]}</td>
                    <td>{data["PositionName"]}</td>
                    <td>
                      <FontAwesomeIcon
                        icon={faEdit}
                        onClick={() => this.props.onEditPosition(data)}
                      />
                    </td>
                    <td>
                      <FontAwesomeIcon
                        icon={faTrash}
                        onClick={() => this.onPositionDelete(data["_id"])}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td />
                  <td>
                    <div id="loading-bar">
                      <BarLoader
                        css={override}
                        sizeUnit={"px"}
                        size={150}
                        color={"#0000ff"}
                        loading={true}
                      />
                    </div>
                  </td>
                  <td />
                  <td />
                </tr>
              </tbody>
            )}
          </table>
        </div> */}
      </div>
    );
  }
}

export default PositionTable;
