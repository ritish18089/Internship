package com.carlofy.backend.repository;

import com.carlofy.backend.model.AccidentRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AccidentRecordRepository extends JpaRepository<AccidentRecord, Long> {
    List<AccidentRecord> findByCarId(Long carId);
}
