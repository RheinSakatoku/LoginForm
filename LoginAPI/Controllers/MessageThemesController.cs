using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LoginAPI.Models;

namespace LoginAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageThemesController : ControllerBase
    {
        private readonly DataBaseContecst _context;

        public MessageThemesController(DataBaseContecst context)
        {
            _context = context;
        }

        // GET: api/MessageThemes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageThemes>>> GetMessageThemes()
        {
            return await _context.MessageThemes.ToListAsync();
        }

        // GET: api/MessageThemes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MessageThemes>> GetMessageThemes(int id)
        {
            var messageThemes = await _context.MessageThemes.FindAsync(id);

            if (messageThemes == null)
            {
                return NotFound();
            }

            return messageThemes;
        }

        // PUT: api/MessageThemes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMessageThemes(int id, MessageThemes messageThemes)
        {
            if (id != messageThemes.MT_ID)
            {
                return BadRequest();
            }

            _context.Entry(messageThemes).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MessageThemesExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/MessageThemes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<MessageThemes>> PostMessageThemes(MessageThemes messageThemes)
        {
            _context.MessageThemes.Add(messageThemes);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMessageThemes", new { id = messageThemes.MT_ID }, messageThemes);
        }

        // DELETE: api/MessageThemes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMessageThemes(int id)
        {
            var messageThemes = await _context.MessageThemes.FindAsync(id);
            if (messageThemes == null)
            {
                return NotFound();
            }

            _context.MessageThemes.Remove(messageThemes);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MessageThemesExists(int id)
        {
            return _context.MessageThemes.Any(e => e.MT_ID == id);
        }
    }
}
