package it.polimi.se2.grazzanimasini.ckb.controllers.model;

public class DataUpdate {
    private String uuid;
    private String columnName;
    private String newValue;

    public DataUpdate() {
        this.uuid = "";
        this.columnName = "";
        this.newValue = "";
    }

    public DataUpdate(String uuid, String columnName, String newValue) {
        this.uuid = uuid;
        this.columnName = columnName;
        this.newValue = newValue;
    }

    public String getuuid() {
        return uuid;
    }

    public void setuuid(String uuid) {
        this.uuid = uuid;
    }

    public String getColumnName() {
        return columnName;
    }

    public void setColumnName(String columnName) {
        this.columnName = columnName;
    }

    public String getNewValue() {
        return newValue;
    }

    public void setNewValue(String newValue) {
        this.newValue = newValue;
    }
}
