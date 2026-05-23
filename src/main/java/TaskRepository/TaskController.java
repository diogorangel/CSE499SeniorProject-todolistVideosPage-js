package TaskRepository;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class TaskController {

    @Autowired
    private TaskRepository repository;

    // READ: List cards
    @GetMapping
    public List<Task> getTasks() {
        return repository.findAll();
    }

    // CREATE: Create card
    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return repository.save(task);
    }

    // UPDATE: Toggle completion status
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        try {
            return repository.findById(id).map(task -> {
                task.setCompleted(taskDetails.isCompleted());
                Task updatedTask = repository.save(task);
                return ResponseEntity.ok(updatedTask);
            }).orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            System.err.println("❌ ERROR UPDATING TASK IN BACKEND:");
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // DELETE: Remove card
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        try {
            System.out.println("🔄 Attempting to remove card with ID: " + id);
            if (repository.existsById(id)) {
                repository.deleteById(id);
                System.out.println("✅ Card with ID " + id + " removed successfully.");
                return ResponseEntity.ok().build();
            }
            System.out.println("⚠️ Card with ID " + id + " was not found in the database.");
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("❌ REAL ERROR REMOVING TASK IN BACKEND:");
            e.printStackTrace(); // This will print the exact error in the Java terminal
            return ResponseEntity.internalServerError().build();
        }
    }
}