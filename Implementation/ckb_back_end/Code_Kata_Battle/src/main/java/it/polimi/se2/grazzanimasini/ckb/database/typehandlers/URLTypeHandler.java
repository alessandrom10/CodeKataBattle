package it.polimi.se2.grazzanimasini.ckb.database.typehandlers;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;

import java.net.MalformedURLException;
import java.net.URL;
import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class URLTypeHandler extends BaseTypeHandler<URL> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, URL parameter, JdbcType jdbcType) throws SQLException {
        ps.setString(i, parameter.toString());
    }

    @Override
    public URL getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String value = rs.getString(columnName);
        return (value != null) ? createURL(value) : null;
    }

    @Override
    public URL getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        String value = rs.getString(columnIndex);
        return (value != null) ? createURL(value) : null;
    }

    @Override
    public URL getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        String value = cs.getString(columnIndex);
        return (value != null) ? createURL(value) : null;
    }

    private URL createURL(String value) {
        try {
            return new URL(value);
        } catch (MalformedURLException e) {
            // Handle the exception or log it as needed
            throw new RuntimeException("Failed to create URL from database value: " + value, e);
        }
    }
}
