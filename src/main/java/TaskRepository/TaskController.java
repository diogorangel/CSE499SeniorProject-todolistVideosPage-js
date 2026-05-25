package TaskRepository;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.Optional;

import TaskRepository.Task;
import TaskRepository.TaskRepository;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskRepository repository;

    @GetMapping
    public List<Task> getTasks() {
        return repository.findAll();
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return repository.save(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task update) {
        return repository.findById(id)
            .map(task -> {
                task.setCompleted(update.isCompleted());
                return ResponseEntity.ok(repository.save(task));
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        try {
            repository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (EmptyResultDataAccessException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/deleteByData")
    public ResponseEntity<Void> deleteTaskByData(@RequestBody Task taskData) {
        Optional<Task> found = repository.findAll().stream()
            .filter(t -> equalsOrNull(t.getTaskName(), taskData.getTaskName())
                    && equalsOrNull(t.getDueDate(), taskData.getDueDate())
                    && equalsOrNull(t.getAssignee(), taskData.getAssignee())
                    && equalsOrNull(t.getCreator(), taskData.getCreator())
                    && equalsOrNull(t.getDescription(), taskData.getDescription()))
            .findFirst();

        if (found.isPresent()) {
            repository.deleteById(found.get().getId());
            return ResponseEntity.ok().build();
        }

        return ResponseEntity.notFound().build();
    }

    private boolean equalsOrNull(Object a, Object b) {
        return a == b || (a != null && a.equals(b));
    }
}
