package com.AliNasir.Em_Project;

import java.util.List;

public interface EmployeeSerivce {
    String createEmployee(Employee employee);
     List<Employee> readEmployees();
    boolean deleteEmployee(Long id);
    String updateEmployee(Long id, Employee employee);
    Employee readEmployee(Long id);

}

